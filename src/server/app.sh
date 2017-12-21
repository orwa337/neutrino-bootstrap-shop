curl \
--header "Content-type: application/json" \
--request POST \
--data '{"customerid": "2", "paymentid": "4", "productids": ["1", "2"]}' \
http://localhost:9090/api/order