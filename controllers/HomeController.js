class HomeController{

    async index(req, res){
        res.send("API EXPRESS - CRISTIAN ADAGOBERTO");
    }

    async validade(req, res) {
        res.send("okay")
    }

}

module.exports = new HomeController();