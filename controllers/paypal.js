import got from "got";

//function to get access token from paypal
const getAccessToken = async () => {
  try {
    const response = await got.post(
      "https://api-m.sandbox.paypal.com/v1/oauth2/token",
      {
        form: { grant_type: "client_credentials" },
        username: process.env.PAYPAL_CLIENT_ID,
        password: process.env.PAYPAL_CLIENT_SECRET,
      }
    );
    //console.log(response.body);
    const data = JSON.parse(response.body);
    const newAccessToken = data.access_token;
    return newAccessToken;
  } catch (error) {
    throw new Error("Failed to get PayPal access token");
  }
};

// function to create a paypal payment
export const createPayPalPayment = async (req, res) => {
  try {
    const accessToken = await getAccessToken();

    const response = await got.post(
      "https://api-m.sandbox.paypal.com/v2/checkout/orders",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        json: {
          intent: "CAPTURE",
          purchase_units: [
            {
              //plaeceholder item
              items: [
                {
                  name: "Halo",
                  description: "Xbox Series X",
                  quantity: "1",
                  unit_amount: {
                    currency_code: "EUR",
                    value: "49.99",
                  },
                },
              ],
              amount: {
                currency_code: "EUR",
                value: "49.99",
                breakdown: {
                  item_total: {
                    currency_code: "EUR",
                    value: "49.99",
                  },
                },
              },
            },
          ],
          payment_source: {
            paypal: {
              experience_context: {
                payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
                payment_method_selected: "PAYPAL",
                brand_name: "KEY STORE",
                shipping_preference: "NO_SHIPPING",
                locale: "it-IT",
                user_action: "PAY_NOW",
                return_url: "https://example.com/returnUrl",
                cancel_url: "https://example.com/cancelUrl",
              },
            },
          },
          responseType: "json",
        },
      }
    );

    //ResponseData could be string or object based on got version
    const responseData =
      typeof response.body === "string"
        ? JSON.parse(response.body)
        : response.body;

    const orderID = responseData.id;
    console.log("Order ID:", orderID);

    return res
      .status(200)
      .json({ orderID, message: "PayPal payment created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// function to capture a paypal payment
export const capturePayment = async (req, res) => {
  try {
    const accessToken = await getAccessToken();
    const { paymentId } = req.params;
    const response = await got.post(
      `https://api-m.sandbox.paypal.com/v2/checkout/orders/${paymentId}/capture`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        json: {
          responseType: "json",
        },
      }
    );

    const paymentData =
      typeof response.body === "string"
        ? JSON.parse(response.body)
        : response.body;

    if (paymentData.status !== "COMPLETED") {
      return res.status(400).json({ error: "Payment incomplete or failed" });
    }

    return res.status(200).json({
      message: "Payment captured successfully",
      paymentData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
