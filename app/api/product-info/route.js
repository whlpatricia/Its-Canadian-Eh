export async function GET(req) {
    const { barcode } = req.query;
  
    if (!barcode) {
      return new Response(JSON.stringify({ message: "Barcode is required" }), {
        status: 400,
      });
    }
  
    const apiKey = "e86vw366lq1kwy3a45ujegfrjha6yq";  // free API key
    const url = `https://api.barcodelookup.com/v3/products?barcode=${barcode}&key=${apiKey}`;
  
    try {
      const response = await fetch(url);
  
      if (!response.ok) {
        const errorText = await response.text();  /
        console.error("Error Response:", errorText);
        return new Response(JSON.stringify({ message: "Error fetching product details" }), { status: 500 });
      }
  
      const data = await response.json();
  
      if (data.products && data.products.length > 0) {
        const product = data.products[0];
        return new Response(
          JSON.stringify({
            brand: product.brand,
            description: product.description,
            title: product.title,
            category: product.category,
            manufacturer: product.manufacturer,
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
  