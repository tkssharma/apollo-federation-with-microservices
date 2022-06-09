export enum Status {
  'pending' = 'pending',
  'failed' = 'failed',
  'progress' = 'progress',
  'processed' = 'processed'
}
export type Notification = {
  uuid?: string;
  created_at?: Date;
  modified_at?: Date;
  name: string;
  type: string;
  external_id: string;
  recipient_email: string;
  recipient_name: string;
  template_data: any;
  template_type: any;
  status: Status;
  attachments?: any;
};
