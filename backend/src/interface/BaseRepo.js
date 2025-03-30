import mongoose from "mongoose";
import Transaction from './TransactionRepo';
const ObjectId = mongoose.Types.ObjectId;

class BaseRepo {
  constructor(model) {
    this.model = model;
    this.getAll = this.getAll.bind(this);
    this.insert = this.insert.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.initTransaction = Transaction.initTransactionSession;
    this.endTransaction = Transaction.endSession;
    this.startTransaction = Transaction.startTransaction;
  }
  /**
   *
   * @param {Object} query it accepts query keyword and page
   *
   * @returns {Object} returns statuscode totalpages and data if exists
   */
  async search(query) {
    try {
      const page = query.page ? parseInt(query.page) : 1;
      const limit = 10;
      const startIndex = (page - 1) * limit;

      const total_pages = Math.ceil(
        (await this.model
          .find({ $text: { $search: query.keyword } })
          .countDocuments()) / limit
      );

      const items = await this.model
        .find({ $text: { $search: query.keyword } })
        .select("-updatedAt -__v")
        .limit(limit)
        .skip(startIndex)
        .lean();

      return {
        statusCode: 200,
        error: false,
        items,
        total_pages: total_pages > 1 ? total_pages : 1,
        page,
      };
    } catch (err) {
      console.log(err);
      return {
        statusCode: 500,
        message: "something went wrong!!",
        error: true,
      };
    }
  }
  async getById(id, query = {}, exclude = []) {
    try {
      let record = await this.model.findById(id).select(exclude).exec();
      if (!record)
        return {
          error: true,
          statusCode: 404,
          message: "item not found",
          item: null,
        };
      else {
        if (query.populate && query.populate.length) {
          record = await this.model.populate(record, query.populate);
        }
        return {
          error: false,
          statusCode: 200,
          message: "",
          item: record,
        };
      }
    } catch (error) {
      console.error(error)
      return {
        error: true,
        statusCode: 500,
        message: "internal server error",
        item: null,
      };
    }
  }
  async getOneByCondition(condition, query = {}, exclude = []) {
    try {
      let record = await this.model
        .findOne(condition)
        .select(exclude)
        .lean()
        .exec();
      if (!record)
        return {
          error: true,
          statusCode: 404,
          message: "item not found",
          item: null,
        };
      else {
        if (query.populate && query.populate.length) {
          record = await this.model.populate(record, query.populate);
        }
        return {
          error: false,
          statusCode: 200,
          message: "",
          item: record,
        };
      }
    } catch (err) {
      return {
        error: true,
        statusCode: 500,
        message: "internal server error",
        item: null,
      };
    }
  }
  async getAll(query, exclude = []) {
    let { page, limit, populate, sort_by = '-createdAt' } = query;
    page = page ? parseInt(page) : 1;
    limit = limit ? Number(limit) : 10;
    const startIndex = (page - 1) * limit;
    delete query.page;
    delete query.limit;
    delete query.populate;

    if (query._id) {
      try {
        query._id = new mongoose.mongo.ObjectId(query._id);
      } catch (error) {
        console.log("not able to generate mongoose id with content", query._id);
      }
    }

    try {
      let items = await this.model
        .find(query)
        .sort(sort_by)
        .skip(startIndex)
        .limit(limit)
        // .populate(populate,fields)
        .select(exclude)
        .exec();
      const total_pages = Math.ceil(
        (await this.model.find(query).countDocuments()) / limit
      );
      if (populate && populate.length) {
        items = await this.model.populate(items, populate);
      }
      return {
        error: false,
        statusCode: 200,
        items,
        total_pages,
        page,
      };
    } catch (errors) {
      return {
        error: true,
        statusCode: 500,
        message: "something went wrong",
      };
    }
  }
  async getCompleteData(query, exclude = ["-__v"]) {
    const { populate, sort_by='createdAt' } = query;
    delete query.populate;

    if (query._id) {
      try {
        query._id = new mongoose.mongo.ObjectId(query._id);
      } catch (error) {
        console.log("not able to generate mongoose id with content", query._id);
      }
    }

    try {
      let items = await this.model
        .find(query)
        .sort(sort_by)
        .select(exclude)
        .exec();

      if (populate && populate.length) {
        items = await this.model.populate(items, populate);
      }
      return {
        error: false,
        statusCode: 200,
        items,
      };
    } catch (errors) {
      return {
        error: true,
        statusCode: 500,
        message: "something went wrong",
      };
    }
  }
  async checkIfItExists({sort_by, ...condition}, populate) {
    try {
      
      let item = await this.model.findOne(condition).sort(sort_by);
      if (item) {
        if (populate && populate.length) {
          item = await this.model.populate(item, populate);
        }
        return {
          isPresent: true,
          item: item.toObject(),
          statusCode: 200,
        };
      }
      return {
        isPresent: false,
        statusCode: 404,
        item: null,
      };
    } catch (err) {
      return {
        error: true,
        isPresent: false,
        statusCode: 500,
        message: "something went wrong",
      };
    }
  }

  async insert(data) {
    try {
      console.info(data);
      let item = await this.model.create(data);
      console.info(item);
      if (item) {
        return {
          error: false,
          statusCode: 201,
          message: "Successfully created",
          item,
        };
      } else {
        return {
          error: true,
          message: "item not found",
          statusCode: 404,
          item: null,
        };
      }
    } catch (error) {
      console.error(this.model, error);
      return {
        error: true,
        statusCode: 500,
        message: "Not able to create item",
        errors: error,
      };
    }
  }

  async update(id, data) {
    try {
      const item = await this.model.findByIdAndUpdate(id, data, {
        new: true,
        returnDocument: "after",
      });
      if (item) {
        return {
          error: false,
          statusCode: 202,
          message: "Successfully Updated",
          item,
        };
      } else {
        return {
          error: true,
          message: "item not found",
          statusCode: 404,
          item: null,
        };
      }
    } catch (error) {
      return {
        error: true,
        statusCode: 500,
        message: error,
      };
    }
  }

  async delete(_id) {
    try {
      const item = await this.model.deleteOne({ _id });
      if (!item)
        return {
          error: true,
          statusCode: 404,
          message: "item not found",
        };

      return {
        error: false,
        statusCode: 201,
        message: "Successfully Deleted Item",
        item,
      };
    } catch (error) {
      return {
        error: true,
        statusCode: 500,
        message: error.message || "something went wrong",
      };
    }
  }
  async insertByPush(condition, data) {
    try {
      const record = await this.model.updateOne(condition, { $push: data });
      if (record.nModified != 0 || record.upserted) {
        return {
          error: false,
          message: "Successfully Updated",
          statusCode: 200,
          record,
        };
      } else {
        return {
          error: true,
          message: "item not found",
          statusCode: 404,
          item: null,
        };
      }
    } catch (error) {
      return {
        error: true,
        statusCode: 500,
        message: error,
      };
    }
  }
  async updateByCondition(condition, data) {
    try {
      const record = await this.model.updateOne(condition, data);
      if (record.nModified != 0 || record.upserted) {
        return {
          error: false,
          message: "Successfully Updated",
          statusCode: 200,
          record,
        };
      } else {
        return {
          error: true,
          statusCode: 404,
          message: "item not found",
        };
      }
    } catch (error) {
      return {
        error: true,
        statusCode: 500,
        message: error,
      };
    }
  }
  async deleteByPull(condition, data, select) {
    try {
      const record = await this.model.updateOne(
        condition,
        { $pull: data },
        select
      );
      if (record.nModified != 0) {
        return {
          error: false,
          message: "Successfully Deleted",
          statusCode: 200,
          record,
        };
      } else {
        return {
          error: true,
          message: "item not found",
          statusCode: 404,
          item: null,
        };
      }
    } catch (error) {
      return {
        error: true,
        statusCode: 500,
      };
    }
  }
  async countItems(query) {
    return await this.model.find(query).countDocuments();
  }
  successResponse(data = {}, status = 200) {
    data.message = data.message || messages[status];
    return {
      error: false,
      statusCode: status,
      ...data,
    };
  }
  errorResponse(message, status = 500, rest={}) {
    message = message || messages[status];
    return {
      error: true,
      statusCode: status,
      message,
      ...rest
    };
  }
  sanitizeAggregationQueries(query) {
    if(query.rotationId) query.rotationId = new ObjectId(query.rotationId)
    if(query.unionId) query.unionId = new ObjectId(query.unionId)
    if(query.roundId) query.roundId = new ObjectId(query.roundId)
    if(query.memberId) query.memberId = new ObjectId(query.memberId)
    if(query.membershipId) query.membershipId = new ObjectId(query.membershipId)
    if(query._id) query._id = new ObjectId(query._id)
    if(query.isPaid && query.isPaid.toLowerCase() == 'true') query.isPaid = true
    if(query.isPaid && query.isPaid.toLowerCase() == 'false') query.isPaid = false
    return query
  }
}

export default BaseRepo;