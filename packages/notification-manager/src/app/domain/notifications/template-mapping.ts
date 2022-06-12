export const EmailTemplate = [
  {
    type: 'USER_SIGNUP_NOTIFICATION',
    subject: 'Welcome to this platform',
    from: 'ack@ack.com',
    template_file: 'user-signup-notification'
  },
  {
    type: 'USER_PASSWORD_RESET_NOTIFICATION',
    subject: 'Password reset email notification',
    from: 'ack@ack.com',
    template_file: 'user-password-reset-notification'
  },
  {
    type: 'HOME_CREATED_NOTIFICATION',
    subject: 'Home Created successfully',
    from: 'ack@ack.com',
    template_file: 'home-created-notification'
  }
]