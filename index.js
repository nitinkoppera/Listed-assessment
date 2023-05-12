// import modules
const { google } = require("googleapis");
const nodemailer = require("nodemailer");

// get clientIds, secret redirecturi refresh
const CLIENT_ID = ''
const CLIENT_SECRET = ''
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = ''

const USER_EMAIL = ''

// config oauth2client
const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// get gmail api
const gmail = google.gmail({ version: "v1", auth: oauth2Client });

// set transporter by nodemailer
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: USER_EMAIL,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: oauth2Client.getAccessToken(),
    },
});


// user defined function to reply to unread first time mails
async function checkEmails() {
    try{
        // retrieving all the unread messages
        const res = await gmail.users.messages.list({
            userId: "me",
            q: "is:unread",
        });

        // if there are none then return
        if (!res.data.messages) {
            return;
        }

        // getting all the label lists
        let labelList = await gmail.users.labels.list({
            userId: "me",
        });
        const email_label = "Auto-Replied";

        // checking auto-replied label exist or create if not
        let label = labelList.data.labels.find((l) => l.name === email_label);
        if (!label) {
            console.log("creating new label ",email_label)
            await gmail.users.labels.create({
                userId: "me",
                resource: {
                    name: email_label,
                },
            });
            labelList = await gmail.users.labels.list({
                userId: "me",
            });
            label = labelList.data.labels.find((l) => l.name === email_label);
        }

        // iterating to the mails which are unread
        for (const msg of res.data.messages) {
            const threadId = msg.threadId;
            const threadRes = await gmail.users.threads.get({
                userId: "me",
                id: threadId,
            });

            const threadMsgs = threadRes.data.messages;

            // checking if already any mail sent from us in this thread
            // if sent then do not auto-reply
            let isAlreadyReplied = false
            for(const message of threadMsgs){
                const from = message.payload.headers.find((header) => header.name == "From").value
                if(from === USER_EMAIL){
                    isAlreadyReplied = true
                    break
                }
            }
            
            // if not replied/sent mail before in this thread
            if (!isAlreadyReplied) {
                
                const email = threadMsgs[0];
                const from = email.payload.headers.find((h) => h.name === "From").value;
                const subject = email.payload.headers.find((h) => h.name === "Subject").value;
                const messageId = email.payload.headers.find((h) => h.name === "Message-ID").value;
                
                const text = `Hi, thank you for your email. This is an auto-reply from ${USER_EMAIL}. I will get back to you as soon as possible.`;

                const mailOptions = {
                    from: USER_EMAIL,
                    to: from,
                    subject: subject,
                    text: text,

                    threadId: threadId,
                    labelIds: [label.id],
                    inReplyTo: messageId,
                };

                // sending reply mail
                await transporter.sendMail(mailOptions);

                console.log(`Auto-replied to ${from}: ${subject}`);

                // to add "auto-replied" label to the thread
                await gmail.users.messages.modify({
                    userId: "me",
                    id: email.id,
                    resource: {
                        addLabelIds: mailOptions.labelIds,
                        threadId: mailOptions.threadId,
                    }
                });
            }
        }
    } catch (error) {
        console.log(error.message);
    }
}

setInterval(async() => {
    console.log('Checking mails...')
    await checkEmails();
}, 10 * 1000);// checking for new mails for every 100 seconnds
