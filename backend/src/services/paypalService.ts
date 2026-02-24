import axios from "axios";

const BASE_URL = process.env.PAYPAL_BASE_URL as string;
const CLIENT_ID = process.env.PAYPAL_CLIENT_ID as string;
const SECRET = process.env.PAYPAL_SECRET as string;

const getAccessToken = async (): Promise<string> => {
  const response = await axios({
    url: `${BASE_URL}/v1/oauth2/token`,
    method: "post",
    auth: {
      username: CLIENT_ID,
      password: SECRET,
    },
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: "grant_type=client_credentials",
  });

  return response.data.access_token;
};

export const createPayPalOrder = async (
  total: number
): Promise<{ id: string; approveLink?: string }> => {

  const accessToken = await getAccessToken();

  const response = await axios.post(
    `${BASE_URL}/v2/checkout/orders`,
    {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "EUR",
            value: total.toFixed(2),
          },
        },
      ],
      application_context: {
        return_url: "https://example.com/success", // j'ai mis fake link en att
        cancel_url: "https://example.com/cancel",
      },
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const approveLink = response.data.links.find(
    (link: any) => link.rel === "approve"
  )?.href;

  return {
    id: response.data.id,
    approveLink,
  };
};


export const capturePayPalOrder = async (
  orderID: string
) => {
  const accessToken = await getAccessToken();

  const response = await axios.post(
    `${BASE_URL}/v2/checkout/orders/${orderID}/capture`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};
