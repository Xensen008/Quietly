import {Resend} from 'resend';

export const  resend = new Resend(process.env.RESEND_API_KEY || "");

// await  resend.emails.send({
//     from:"arnabjyotikakati008@gmail.com",
//     to:"useremail@.com",
//     subject:"hello send",
//     html: `<p>Click <a href="https://www.google.com">here</a> to visit Google</p>`
// })