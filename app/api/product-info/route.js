export async function GET(req) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const barcode = url.searchParams.get('barcode');

  if (!barcode) {
    return new Response(JSON.stringify({ message: "Barcode is required" }), {
      status: 400,
    });
  }

  const apiKey = "2srmktq5t87q6yb038vjblduxzilr4";  // free API key
  const apiUrl = new URL("https://api.barcodelookup.com/v3/products");
  apiUrl.searchParams.append('barcode', barcode);
  apiUrl.searchParams.append('key', apiKey);

  try {
    const response = await fetch(apiUrl.toString());

    const responseText = await response.text();

    if (!response.ok) {
      console.error("Error Response:", responseText);
      return new Response(JSON.stringify({ message: "Error fetching product details" }), { status: 500 });
    }

    const data = JSON.parse(responseText);

    if (data.products && data.products.length > 0) {
      const product = data.products[0];
      return new Response(
        JSON.stringify({
          brand: product.brand,
          title: product.title,
          images: product.images || [],  // Return all images as an array
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
