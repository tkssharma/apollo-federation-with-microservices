export type SendEmailInput = {
  from: string;
  to: string;
  subject?: string;
  text?: string;
  html?: string;
};

export type SendBatchEmailInput = {
  from: string;
  to: string[];
  subject?: string;
  text?: string;
  html?: string;
  templateId: string;
  dynamicTemplateData?: Object;
};
