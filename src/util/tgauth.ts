import crypto from 'crypto'

const SECRET_KEY = process.env.SECRET_KEY

const MAX_AUTH_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export function verifyTelegramInitData(initData: { [key: string]: any }) {
    // Extract the data from the initData query string
    const parsedData = Object.fromEntries(new URLSearchParams(initData));
  
    // Ensure that all the necessary fields are present
    if (!parsedData || !parsedData.hash || !parsedData.auth_date || !parsedData.user) {
      throw new Error('Invalid initData: Missing required fields');
    }
  
    // Check if the auth_date is within the allowed time window (e.g., 24 hours)
    const authDate = parseInt(parsedData.auth_date, 10) * 1000; // Convert to milliseconds
    const currentTime = Date.now();
    if (currentTime - authDate > MAX_AUTH_TIME) {
      throw new Error('Invalid initData: auth_date is too old');
    }
  
    // Sort the parameters alphabetically by key (excluding the 'hash' field)
    const params = Object.entries(parsedData)
      .filter(([key]) => key !== 'hash') // Exclude the 'hash' parameter
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB)) // Sort by key alphabetically
      .map(([key, value]) => `${key}=${value}`); // Format as key=value
  
    // Rebuild the data-check-string
    const dataCheckString = params.join('\n'); // Concatenate with newline separator

    // Generate the secret key using HMAC-SHA256 of bot token and the constant string "WebAppData"
    const secretKey = crypto.createHmac('sha256', 'WebAppData')
      .update(process.env.BOT_TOKEN!)
      .digest();
  
    // Calculate the expected hash using HMAC-SHA256 on the data-check-string with the secret key
    const hash = crypto.createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    // Compare the calculated hash with the provided hash in the initData
    if (hash !== parsedData.hash) {
      throw new Error('Invalid initData: Hash mismatch');
    }
  
    // If verification is successful, return the user ID
    const user = JSON.parse(parsedData.user);
    console.log(user)
    return [`${user.id}`, `${user.first_name} ${user.last_name}`];
  }

  export  function verifyOAuthData(data: { [key: string]: any }) {
    const secretKey = crypto.createHash('sha256').update(process.env.BOT_TOKEN!).digest();
    const checkString = Object.keys(data)
        .filter((key) => key !== 'hash')
        .sort()
        .map((key) => `${key}=${data[key]}`)
        .join('\n');
    const hash = crypto.createHmac('sha256', secretKey).update(checkString).digest('hex');

    // Verify the hash matches
    if (hash !== data.hash) {
        throw new Error();
    }

    // Verify the authentication date
    const currentTime = Math.floor(Date.now() / 1000); // Current time in Unix seconds

    if (currentTime - data.auth_date > MAX_AUTH_TIME) {
        throw new Error();
    }
    console.log(data)
    return [`${data.id}`, `${data.first_name} ${data.last_name}`];
}