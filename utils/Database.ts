import { MongoDBClient } from "./MongoDBClient";

export class Database {

    static async getLoginUser(username: string) {

        const mongo = new MongoDBClient();

        await mongo.connect();

        const user = await mongo.getLoginUser(username);

        await mongo.close();

        return user;
    }

}