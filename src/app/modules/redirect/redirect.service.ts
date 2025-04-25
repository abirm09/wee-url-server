import { AccessedDeviceType, SubscriptionPlan } from "@prisma/client";
import crypto from "crypto";
import { NextFunction, Request, Response } from "express";
import { prisma } from "../../../app";
import { env } from "../../../config";
import { deviceTypeMap } from "../../../const";
import { TIpInFo } from "../../../types";
import { CacheManager, IPInfo, UserAgentParser } from "../../../utilities";
import { TUrlMetricInput } from "../url_management/url_metric/urlMetric.types";
import { TRedirectURLData } from "./redirect.types";

const redirect = async (req: Request, res: Response, next: NextFunction) => {
  if (req.originalUrl.startsWith("/api/v1")) return next();

  const shortCode = req.originalUrl.replace("/", "");
  const userAgent = UserAgentParser(req.headers["user-agent"]);
  const rawDeviceType = userAgent?.device?.type;
  const mappedDeviceType: AccessedDeviceType | null = rawDeviceType
    ? (deviceTypeMap[rawDeviceType] ?? null)
    : null;

  // Run IPInfo BEFORE transaction
  let ipData: TIpInFo | null = null;
  if (req.userIp) {
    ipData = await IPInfo(req.userIp); // This can be slow
  }

  // Start transaction AFTER all slow stuff
  return prisma.$transaction(async (tx) => {
    let url: TRedirectURLData = await CacheManager.getUrlCache(shortCode);

    if (!url) {
      url = await tx.url.findUnique({
        where: { shortCode },
        select: {
          id: true,
          fullUrl: true,
          user: {
            select: {
              subscriptions: {
                where: {
                  isActive: true,
                },
                select: {
                  plan: {
                    select: {
                      type: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      if (url) await CacheManager.setUrlCache(shortCode, url);
    }

    if (!url) return next();

    const subscriptionType = url?.user?.subscriptions[0]?.plan?.type || "free";

    let planData: SubscriptionPlan | null =
      await CacheManager.getSubscriptionPlanCache(subscriptionType);

    if (!planData) {
      planData = await tx.subscriptionPlan.findUnique({
        where: {
          type: subscriptionType,
        },
      });
      await CacheManager.setSubscriptionPlanCache(subscriptionType, planData);
    }

    const urlMetric: TUrlMetricInput = {
      urlId: url.id,
      accessedFromIp: req.userIp || null,
      accessedFromCity: ipData?.city || null,
      accessedFromCountry: ipData?.country || null,
      accessedDeviceType: mappedDeviceType,
      userAgent: req.headers["user-agent"] || null,
      isBot: !!userAgent?.bot,
    };

    await tx.urlMetrics.create({ data: urlMetric });

    if (planData?.showAds) {
      const nonce = crypto.randomBytes(16).toString("base64");
      res.setHeader(
        "Content-Security-Policy",
        `script-src 'self' 'nonce-${nonce}';`
      );
      return res.render("adds-page", {
        nonce,
        fullUrl: url.fullUrl,
        clientSide: env.client_side_urls[0],
        env: env.env,
      });
    } else {
      return res.status(301).redirect(url.fullUrl);
    }
  });
};

export const RedirectServices = {
  redirect,
};
