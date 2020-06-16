const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rcshcompany@gmail.com',
    pass: 'becomePROS123'
  }
});

const adminMailOptions = {
    from: 'Do not reply to this email <noreply@mtute.lk>',
    to: 'eranthawelikala@gmail.com, ruwanchamara94.rc@gmail.com',
    subject: 'Informing about new contact-us message',
    text: 'Mtute has recieved a contact-us message from a client. Please check it using admin panel',
    html: '<a href="https://www.mtute.lk/profile/admin">Check Updates</a>'
}

module.exports = {transporter: transporter, adminMailOptions: adminMailOptions};