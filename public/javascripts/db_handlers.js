import mongoose from "mongoose";
import {NoCostForUser, NoCostBetweenDates, NoCostWithCurrentCategory} from "./errors.js";
import computedcosts from "../routes/computedcosts.js";
import cost from "../../routes/cost";

const connection = await mongoose.connect("mongodb+srv://yuvalk:yuvalk@trackapp.huktv.mongodb.net/test") // if not connction need to chack this whit password


const costs = connection.model('costs', {
    user_id: {type: String}, cost: {type: Array}, sum: {type: Number}
})


async function isCostDocExist(userId) {
    const doc = await costs.findOne({user_id: userId});
    if (doc == null) {
        return false
    }
    return doc
}

async function getAllCostByUserId(userId) {
    const doc = await isCostDocExist(userId);
    if ((doc === false) || (doc['costs'].length < 1)) {
        throw new NoCostForUser()
    }
    return {
        "costs": doc.toJSON()["costs"],
        "sum": doc.toJSON()["sum"]
    }
}

async function getCostListFromDocs(docs) {
    const costsList = []
    for (let i = 0; i < docs.length; i++) {
        costsList.push(docs[i]["cost"])
    }
    return costsList
}

async function getCurrentSumByUserId(userId) {
    const doc = await costs.findOne({user_id: userId});
    return doc.toJSON()["sum"]
}


async function addNewCostByUserId(userId, cost) {
    if (await isCostDocExist(userId) === false) {
        const doc = new costs({user_id: userId, cost: [], sum: 0})
        await doc.save()
    }
    let newSum = await getCurrentSumByUserId(userId)
    newSum = newSum + cost.cost
    await costs.updateOne({user_id: userId}, {$push: {costs: cost}, $set: {sum: newSum}});
}


async function getCostStatisticByDates(userId, startDate, endDate) {
    const sumByDates = await costs.aggregate([{$unwind: "$costs"}, {
        $match: {
            user_id: userId,
            "costs.date": {$gte: startDate, $lt: endDate}
        }
    }, {$group: {_id: null, sum: {$sum: "$costs.cost"}}}
    ])
    const docsByDates = await costs.aggregate([{$unwind: "$costs"}, {
        $match: {
            user_id: userId,
            "costs.date": {$gte: startDate, $lt: endDate}
        }
    }
    ])
    if ((docsByDates == null) || docsByDates.length === 0) {
        throw new NoCostBetweenDates()
    }


    return {
        "number_of_ costs": docsByDates.length,
        "sum_of_costs": sumByDates[0]["sum"],
        "costs": await getCostListFromDocs(docsByDates)
    }
}

async function getCostStatisticByCategory(userId, category) {
    const sumByCategory = await costs.aggregate([{$unwind: "$costs"}, {
        $match: {
            user_id: userId,
            "costs.category": category
        }
    }, {$group: {_id: null, sum: {$sum: "$costs.cost"}}}
    ])

    const docsByCategory = await costs.aggregate([{$unwind: "$costs"}, {
        $match: {
            user_id: userId,
            "costs.category": category
        }
    }
    ])
    if ((docsByCategory == null) || docsByCategory.length === 0) {
        throw new NoCostWithCurrentCategory()
    }
    return {
        "number_of_costs": docsByCategory.length,
        "sum_of_costs": sumByCategory[0]["sum"],
        "costs": await getCostListFromDocs(docsByCategory)
    }

}

const User = connection.model('users', {
    user_id: {type: String},
    first_name: {type: String},
    last_name: {type: String},
    password: {type: String},
    birthday: {type: Date}
})


async function insertNewUser(user) {
    const userDoc = new User({
        user_id: user.user_id,
        first_name: user.first_name,
        last_name: user.first_name,
        password: user.password,
        birthday: user.birthday
    })

    await userDoc.save()

}

async function isUserExists(user_id) {
    const doc = await User.findOne({user_id: user_id});
    return doc != null;


}
async function getUserByUsername(user_id) {
    const doc = await User.findOne({user_id: user_id});
    return  doc.toJSON()
}


export {
    getAllCostByUserId,
    addNewCostByUserId,
    getCostStatisticByDates,
    getCostStatisticByCategory,
    insertNewUser,
    isUserExists,
    getUserByUsername
}