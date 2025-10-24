import { z } from "zod";

export const AcceptMessageSchema = z.object({
  isAcceptingMessage: z.boolean(),
});
