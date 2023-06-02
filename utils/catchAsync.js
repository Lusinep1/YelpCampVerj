module.exports = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch(next);
  };
};

// function catchAsync(fn) {
//     return function(req, res, next){
//         fn(req, res, next).catch(e => next(e))
//     }
// }

//fn-y kvercne mer unecac saaax async funkcian
