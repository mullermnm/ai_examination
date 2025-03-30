class Controller {

    constructor(service) {
        this.service = service;
        this.getAll = this.getAll.bind(this);
        this.search = this.search.bind(this);
        this.get = this.get.bind(this);
        this.insert = this.insert.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    async getAll(req, res) {
        return res.status(200).send(await this.service.repo.getAll(req.query, ['-__v', '-updatedAt']));
    }
    async search(req, res) {
        const response = await this.service.repo.search(req.query);
        return res.status(response.statusCode).send(response);
    }

    async get(req, res) {
        const response = await this.service.repo.getById(req.params.id, ['-__v', '-updatedAt'])
        return res.status(response.statusCode).send(response);
    }

    async insert(req, res) {
        if(req.user) {
            req.body.unionId = req.user.unionId
            req.body.registeredBy = req.user.id
        }
        const response = await this.service.repo.insert(req.body);
        if (response.error) return res.status(response.statusCode).send(response);
        return res.status(201).send(response);
    }

    async update(req, res) {
        const { id } = req.params;
        const response = await this.service.repo.update(id, req.body);
        return res.status(response.statusCode).send(response);
    }

    async delete(req, res) {
        const { id } = req.params;
        const response = await this.service.repo.delete(id);
        return res.status(response.statusCode).send(response);
    }

}

export default Controller;