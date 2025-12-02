<?php
// Test save order API
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html>
<head>
    <title>Test Order API</title>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>
<body>
    <h1>Test Save Order API</h1>
    <button onclick="testOrder()">Test Simpan Order</button>
    
    <div id="result" style="margin-top: 20px; padding: 20px; background: #f0f0f0;"></div>

    <script>
        async function testOrder() {
            const testData = {
                customerName: "Test Customer",
                customerPhone: "08123456789",
                customerEmail: "test@example.com",
                customerAddress: "Jl. Test No. 123",
                subtotal: 50000,
                shippingCost: 10000,
                paymentMethod: "Transfer Bank",
                notes: "Test order",
                items: [
                    {
                        productId: 1,
                        productName: "Test Product 1",
                        price: 25000,
                        quantity: 2,
                        subtotal: 50000
                    }
                ]
            };

            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = '<p>Sending request...</p>';

            try {
                const response = await fetch('api/save-order.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(testData)
                });

                const text = await response.text();
                resultDiv.innerHTML = '<h3>Raw Response:</h3><pre>' + text + '</pre>';

                try {
                    const result = JSON.parse(text);
                    resultDiv.innerHTML += '<h3>Parsed JSON:</h3><pre>' + JSON.stringify(result, null, 2) + '</pre>';

                    if (result.success) {
                        Swal.fire('Success!', 'Order Number: ' + result.orderNumber, 'success');
                    } else {
                        Swal.fire('Error', result.message, 'error');
                    }
                } catch (e) {
                    Swal.fire('Parse Error', 'Response is not valid JSON', 'error');
                }

            } catch (error) {
                resultDiv.innerHTML = '<p style="color: red;">Error: ' + error.message + '</p>';
                Swal.fire('Network Error', error.message, 'error');
            }
        }
    </script>
</body>
</html>
