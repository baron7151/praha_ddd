export class Email {
  public value: string
  constructor(email: string) {
    const expression =
      /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/
    if (!expression.test(email) || email === '') {
      throw new Error('The format of the email address is incorrect.')
    } else if (email.length > 254) {
      throw new Error('The email address exceeds 254 characters.')
    }
    this.value = email
  }
  changeEmail(email: string): Email {
    const expression =
      /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/
    if (!expression.test(email)) {
      throw new Error('The format of the email address is incorrect.')
    } else if (email.length > 254) {
      throw new Error('The email address exceeds 254 characters.')
    }
    return new Email(email)
  }
  equals(email: Email) {
    return this.value === email.value ? true : false
  }
}
