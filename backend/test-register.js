// Menggunakan global fetch bawaan Node.js 18+


async function runTest() {
  console.log("Mencoba melakukan registrasi akun baru ke http://localhost:5000/api/v1/auth/register...");
  
  const payload = {
    fullName: "Faiz Abdurrachman",
    email: "faiz@student.unu-jogja.ac.id", // Menggunakan domain UNU sesuai aturan
    password: "Password123" // Mengandung huruf dan angka, minimal 8 karakter
  };

  try {
    const response = await fetch("http://localhost:5000/api/v1/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    
    console.log("\n================ STATUS RESPONSE ================");
    console.log(`Status Code: ${response.status} ${response.statusText}`);
    console.log("=================================================");
    console.log("Hasil Response Body:");
    console.log(JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error("\nGagal terhubung ke server backend!", error.message);
    console.log("Pastikan server backend sudah menyala dengan menjalankan 'npm run dev' di folder backend.");
  }
}

runTest();
