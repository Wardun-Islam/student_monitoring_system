const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const {
   user_photo_initial_upload_path,
   user_photo_initial_link,
} = require("../config");

const remove_file = ({ file_path }) => {
   return fs.promises.unlink(file_path);
};

const updateUserPhoto = ({ user, photo, delete_photo }) => {
   if (photo) {
      if (user.user_image && user.user_image.includes("localhost")) {
         const delete_file_path_temp = user.user_image.split("/");
         const delete_path =
            user_photo_initial_upload_path +
            delete_file_path_temp[delete_file_path_temp.length - 1];
         return fs.promises
            .unlink(delete_path)
            .then((remove_data) => {
               const photo_name = uuidv4() + photo.name;
               const photo_path = user_photo_initial_upload_path + photo_name;
               const photo_link = user_photo_initial_link + photo_name;

               const dir_list = photo_path.split("/");
               dir_list.pop();
               const dir = dir_list.join("\\");
               if (!fs.existsSync(dir)) {
                  fs.mkdirSync(dir, { recursive: true });
               }
               return photo
                  .mv(photo_path)
                  .then((data) => {
                     return Promise.resolve({
                        updated: true,
                        file_link: photo_link,
                     });
                  })
                  .catch((error) => {
                     return Promise.reject({
                        updated: false,
                        error: {
                           ecode: 1110,
                           details: "Failed delete file.",
                           err: error,
                        },
                     });
                  });
            })
            .catch((error) => {
               if (error.code === "ENOENT") {
                  const photo_name = uuidv4() + photo.name;
                  const photo_path =
                     user_photo_initial_upload_path + photo_name;
                  const photo_link = user_photo_initial_link + photo_name;

                  const dir_list = photo_path.split("/");
                  dir_list.pop();
                  const dir = dir_list.join("\\");
                  if (!fs.existsSync(dir)) {
                     fs.mkdirSync(dir, { recursive: true });
                  }
                  return photo
                     .mv(photo_path)
                     .then((data) => {
                        return Promise.resolve({
                           updated: true,
                           file_link: photo_link,
                        });
                     })
                     .catch((err) => {
                        return Promise.reject({
                           updated: false,
                           error: {
                              ecode: 1110,
                              details: "Failed delete file.",
                              err: err,
                           },
                        });
                     });
               } else {
                  return Promise.reject({
                     updated: false,
                     error: {
                        ecode: 1110,
                        details: "Failed delete file.",
                        err: error,
                     },
                  });
               }
            });
      } else {
         const photo_name = uuidv4() + photo.name;
         const photo_path = user_photo_initial_upload_path + photo_name;
         const photo_link = user_photo_initial_link + photo_name;

         const dir_list = photo_path.split("/");
         dir_list.pop();
         const dir = dir_list.join("\\");
         if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
         }
         return photo
            .mv(photo_path)
            .then(() => {
               return Promise.resolve({
                  updated: true,
                  file_link: photo_link,
               });
            })
            .catch((error) => {
               return Promise.reject({
                  updated: false,
                  error: {
                     ecode: 1110,
                     details: "Failed delete file.",
                     err: error,
                  },
               });
            });
      }
   } else {
      if (delete_photo && user.account_type === "teacher") {
         if (user.user_image && user.user_image.includes("localhost")) {
            const delete_file_path_temp = user.user_image.split("/");
            const delete_path =
               user_photo_initial_upload_path +
               delete_file_path_temp[delete_file_path_temp.length - 1];
            return fs.promises
               .unlink(delete_path)
               .then((remove_data) => {
                  return Promise.resolve({ updated: true, file_link: null });
               })
               .catch((error) => {
                  return Promise.reject({
                     updated: false,
                     error: {
                        ecode: 1110,
                        details: "Failed delete file.",
                        err: error,
                     },
                  });
               });
         } else {
            return Promise.resolve({ updated: true, file_link: null });
         }
      } else if (delete_photo && user.account_type === "student") {
         return Promise.reject({
            updated: false,
            error: {
               ecode: 1110,
               details: "Student account_type i not allowed to remove image.",
               err: error,
            },
         });
      } else {
         return Promise.resolve({ updated: true, file_link: user.user_image });
      }
   }
};

module.exports = {
   remove_file,
   updateUserPhoto,
};
