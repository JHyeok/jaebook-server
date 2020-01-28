import { Service } from "typedi";
import { NextFunction, Request, Response } from "express";
import UserService from "../service/user.service";

@Service()
class UserController {
    constructor(private userService: UserService) {}

    public getUsers = async (req: Request, res: Response) => {
        const users = await this.userService.getUsers();
        res.send(users);
    };

    public getUserById = async (req: Request, res: Response) => {
        const user = await this.userService.getUserById(req.params.userId);
        res.send(user);
    };

    public createUser = async (req: Request, res: Response) => {
        const user = await this.userService.createUser(req.body);
        res.send(user);
    };

    public deleteUser = async (req: Request, res: Response) => {
        const user = await this.userService.deleteUser(req.params.userId);
        res.send(user);
    };
}

export default UserController;
