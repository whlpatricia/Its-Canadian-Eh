export async function GET(req) {
  const { barcode } = req.query;

  if (!barcode) {
    return new Response(JSON.stringify({ message: "Barcode is required" }), {
      status: 400,
    });
  }

  const apiKey = "e86vw366lq1kwy3a45ujegfrjha6yq";  // free API key
  const url = new URL("https://api.barcodelookup.com/v3/products");
  url.searchParams.append('barcode', barcode);
  url.searchParams.append('key', apiKey);

  try {
    const response = await fetch(url.toString());

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error Response:", errorText);
      return new Response(JSON.stringify({ message: "Error fetching product details" }), { status: 500 });
    }

    const data = await response.json();

    console.log(data);
    if (data.products && data.products.length > 0) {
      const product = data.products[0];

      // Return the brand of the product
      return new Response(
        JSON.stringify({
          brand: product.brand,
        }),
        { status: 200 }
      );
    } else {
      return new Response(JSON.stringify({ message: "Product not found" }), { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching product details:", error);
    return new Response(JSON.stringify({ message: "Error fetching product details" }), { status: 500 });
  }
}
