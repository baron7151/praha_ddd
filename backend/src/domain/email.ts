export class Email {
  private email: string
  constructor(email: string) {
    const expression = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
    if (!expression.test(email) && email != '') {
      throw new Error('The format of the email address is incorrect.')
    } else if (email.length > 254) {
      throw new Error('The email address exceeds 254 characters.')
    }
    this.email = email
  }
  changeEmail(email: string): Email {
    const expression = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
    if (!expression.test(email)) {
      throw new Error('The format of the email address is incorrect.')
    } else if (email.length > 254) {
      throw new Error('The email address exceeds 254 characters.')
    }
    return new Email(email)
  }
}
