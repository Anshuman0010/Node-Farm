teSever((req, res) => {
    res.end("Hii from Server");
})

server.listen(8000, '127.0.0.1', () => {
    console.log("Listening from server");
});