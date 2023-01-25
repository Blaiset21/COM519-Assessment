const Army = require("../models/Army");
const bodyParser = require("body-parser");

exports.list = async (req, res) => {
  try {
    const armies = await Army.find({});
    res.render("armies", { armies: armies, message: req.query?.message});
  } catch (e) {
    res.status(404).send({ message: "could not list armies" });
  }
};



exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    await Army.findByIdAndRemove(id);
    res.redirect("/armies");
  } catch (e) {
    res.status(404).send({
      message: `could not delete record ${id}.`,
    });
  }
};

exports.edit = async (req, res) => {
  const id = req.params.id;
  try {
    const army = await Army.findById(id);
    res.render('update-army', { army: army, id: id, errors: {}});
  } catch (e) {
    res.status(404).send({
      message: `could not find army ${id}.`,
    });
  }
};
 
exports.update = async (req, res) => {
  const id = req.params.id;
  try {
    await Army.updateOne({_id: id}, req.body);
    const army = await Army.findById(id);
    console.log(army);

    res.redirect(`/armies/?message=${army.name} has been updated`);
  } catch (e) {
    if (e.errors) {
      console.log(e.errors);
      return res.render('update-army', {errors: e.errors});
    }

    res.status(404).send({
      message: `could not update army ${id}.`,
    });
  }
}

exports.create = async (req, res) => {
    try{
      const user = await User.findById(req.body.user_id);
      let army = new Army({name: req.body.name, owner: user.name, faction: req.body.faction, points: req.body.points});
      await army.save();
      res.redirect(`/armies/?message=${req.body.name} has been created`);
    } catch (e) {
      if (e.errors) {
        console.log(e.errors);
        return res.render('create-army', {errors: e.errors});
      }
      return res.status(400).send({message: JSON.parse(e)})
    }
    
}