export async function POST(request) {
  try {
    const { password } = await request.json();

    // Get the demo password from environment variable
    const demoPassword = process.env.DEMO_PASSWORD;

    // If DEMO_PASSWORD is not set, allow access (backward compatible)
    if (!demoPassword) {
      return new Response(
        JSON.stringify({ authenticated: true }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Verify password
    const isAuthenticated = password === demoPassword;

    return new Response(
      JSON.stringify({ authenticated: isAuthenticated }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Password verification error:", error);

    return new Response(
      JSON.stringify({
        authenticated: false,
        error: "Failed to verify password"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
