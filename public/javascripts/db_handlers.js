import mongoose from "mongoose";
import {NoExpensesForUser, NoExpensesBetweenDates, NoExpensesWithCurrentCategory} from "./errors.js";
import computedcosts from "../routes/computedcosts.js";

const connection = await mongoose.connect("mongodb+srv://yuvalk:yuvalk@trackapp.huktv.mongodb.net/test") // if not connction need to chack this whit password
