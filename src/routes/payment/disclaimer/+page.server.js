import {MongoClient} from "mongodb";
import * as dotenv from 'dotenv';
import {redirect} from "@sveltejs/kit";

dotenv.config();

const client = new MongoClient(process.env.MONGO_URL);
const money = client.db("Money");
const passes = money.collection("mo_passes");
const userDatabase = client.db("User");
const user = userDatabase.collection("us_user_data");

export const load = async (event) => {
    const session = await event.locals.getSession();
    if (!session?.user) {
        redirect(302, '/passes?signedOut');
    } else {
        let foundUser = await user.findOne({email: session.user.email})
        if(!foundUser) {
            redirect(302, '/passes');
        } else {
            let ownedPasses = await passes.find({email: session.user.email}).toArray()
            if(ownedPasses.length === 2) {
                redirect(302, '/passes?alreadyOwned');
            }
        }
    }
}