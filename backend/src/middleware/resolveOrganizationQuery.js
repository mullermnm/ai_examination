import mongoose from "mongoose";
import organization from "../interface/master/organization";
export default (key, value = true) =>
  async (req, res, next) => {
    try {
      const orgId = req.user.orgId;
      if (req.query.organization) {
        const organizations = req.query.organization
          .split(",")
          .map(orgId => mongoose.Types.ObjectId(orgId));
        req.query.organization = {
          $in: organizations,
        };
      } else {
        const { error, items } = await organization.getCompleteData(
          { allParents: orgId },
          "_id"
        );
        if (error || !items || !items.length) {
          req.query.organization = mongoose.Types.ObjectId(orgId);
        } else {
          const organizations = items.map(({ _id }) => mongoose.Types.ObjectId(_id));
          req.query.organization = {
            $in: organizations,
          };
        }
      }
      return next();
    } catch (e) {
      console.log(e);
      return next();
    }
  };
