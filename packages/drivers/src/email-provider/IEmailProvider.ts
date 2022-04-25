import type { SendEmailInput, SendBatchEmailInput } from "./types";

export abstract class IEmailProvider {
  public abstract sendEmail<U extends SendEmailInput>(
    input: U
  ): Promise<unknown>;

  public abstract sendBatchEmail<U extends SendBatchEmailInput>(
    input: U
  ): Promise<unknown>;
}
