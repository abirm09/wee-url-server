import { z } from "zod";

const passwordValidatorRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%&*]).{8,}$/;

/**
 * The function `passwordZodSchema` creates a Zod schema for validating passwords with specific
 * requirements.
 * @param [isOptional=false] - The `isOptional` parameter in the `passwordZodSchema` function is a
 * boolean flag that determines whether the password field is optional or required in the schema. If
 * `isOptional` is set to `true`, the password field will be marked as optional in the schema, allowing
 * it to be
 * @returns The `passwordZodSchema` function returns a Zod schema for validating passwords. The schema
 * ensures that the password is a string, at least 8 characters long, and contains at least 1 uppercase
 * letter, 1 lowercase letter, 1 number, and 1 special character (@#$%&*). If the `isOptional`
 * parameter is set to `true`, the schema allows the
 */
const input = (isOptional = false) => {
  const schema = z
    .string({ required_error: "Password is required" })
    .refine((password) => passwordValidatorRegex.test(password), {
      message:
        "Invalid password. It must be 8 characters long with at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@#$%&*).",
    });

  return isOptional ? schema.optional() : schema;
};

export const PasswordValidations = {
  input,
};
