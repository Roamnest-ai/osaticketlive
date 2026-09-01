const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Resend } = require("resend");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("OSA Ticket Live email server is running.");
});

app.post("/send-ticket", async (req, res) => {

    try {

        const {
            customerName,
            customerEmail,
            ticketName,
            ticketNumber,
            amount,
            eventName,
            eventDate,
            eventVenue,
            eventTime,
            transactionCode
        } = req.body;

        if (!customerEmail || !customerName || !ticketNumber) {

            return res.status(400).json({
                success: false,
                message: "Missing customer email, name or ticket number."
            });

        }

        const { data, error } = await resend.emails.send({

            from: "OSA Ticket Live <onboarding@resend.dev>",

            to: [customerEmail],

            subject: "Your OSA Ticket - Kamba Festival 2026",

            html: `
                <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:25px;border:1px solid #eee;border-radius:10px;">

                    <h1 style="color:#e60023;">
                        OSA Ticket Live
                    </h1>

                    <h2>
                        Your Ticket Is Confirmed 🎟️
                    </h2>

                    <p>
                        Hello <strong>${customerName}</strong>,
                    </p>

                    <p>
                        Your ticket for the event has been confirmed.
                    </p>

                    <hr>

                    <p>
                        <strong>Event:</strong> ${eventName}
                    </p>

                    <p>
                        <strong>Date:</strong> ${eventDate}
                    </p>

                    <p>
                        <strong>Venue:</strong> ${eventVenue}
                    </p>

                    <p>
                        <strong>Time:</strong> ${eventTime}
                    </p>

                    <p>
                        <strong>Ticket:</strong> ${ticketName}
                    </p>

                    <p>
                        <strong>Ticket Number:</strong> ${ticketNumber}
                    </p>

                    <p>
                        <strong>Amount Paid:</strong> ${amount}
                    </p>

                    <p>
                        <strong>Transaction:</strong> ${transactionCode}
                    </p>

                    <hr>

                    <p>
                        Please keep this email and your ticket number for entry.
                    </p>

                    <p>
                        Thank you for choosing OSA Ticket Live.
                    </p>

                </div>
            `

        });

        if (error) {

            console.error("Resend error:", error);

            return res.status(500).json({
                success: false,
                message: error.message || "Email could not be sent."
            });

        }

        res.json({
            success: true,
            message: "Ticket email sent successfully.",
            emailId: data.id
        });

    }

    catch (error) {

        console.error("Server error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while sending ticket."
        });

    }

});

app.listen(PORT, () => {

    console.log(
        `OSA Ticket Live server running at http://localhost:${PORT}`
    );

});
