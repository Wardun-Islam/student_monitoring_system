const knex = require("knex");
const { db_client, db_connection } = require("../config");
// Database Setup
const db = knex({
   client: db_client,
   connection: db_connection,
});

const insert_into_table = ({ table_name, data, returning_column }) => {
   return db(table_name).insert(data).returning(returning_column);
};

const get_from_table = ({
   select_column,
   table_name,
   where_column,
   where_value,
}) => {
   return db
      .select(select_column)
      .from(table_name)
      .where(where_column, "=", where_value);
};

const get_from_table_multiple_condition = ({
   select_column,
   table_name,
   where_column_value,
}) => {
   return db.select(select_column).from(table_name).where(where_column_value);
};

const get_all_column_from_table = ({ table_name, where_value }) => {
   return db(table_name).where(where_value);
};

const getUserFromEmail = (email) => {
   return db.select().from("users").where("email", "=", email);
};

const getUserFromUserId = (user_id) => {
   return db.select().from("users").where("user_id", "=", user_id);
};

const getTeacherClasses = (teacher_id) => {
   return db("class_room").where("teacher_id", teacher_id);
};

const getStudentClassesCode = (student_id) => {
   return db("class_student").where("student_id", student_id);
};

const getStudentClasses = (class_room_ids) => {
   return db("class_room").whereIn("class_room_id", class_room_ids);
};

const getAllAssignments = (class_ids) => {
      return db("assignment")
        .join("class_room", "assignment.class_id", "class_room.class_room_id")
        .select(
          "assignment_id",
          "post_description",
          "post_date",
          "name",
          "section"
        )
        .whereIn("assignment.class_id", class_ids)
        .orderBy("post_date", "desc");
};



// select email, user_id, first_name, last_name from assignment 
// join class_room 
// on assignment.class_id=class_room_id
// join class_student 
// on class_room.class_room_id=class_student.class_id 
// join users
// on class_student.student_id=users.user_id
// where assignment.assignment_id=assignment_id
const getAllStudents = (assignment_id) => {
  return db("assignment")
    .join("class_room", "assignment.class_id", "class_room.class_room_id")
    .join("class_student", "class_room.class_room_id", "class_student.class_id")
    .join("users", "class_student.student_id", "users.user_id")
    .select("user_id", "email", "first_name", "last_name", "user_image", "teacher_id")
    .where("assignment.assignment_id", assignment_id);
};



const getComments = (assignment_id) => {
   return db("comments")
      .join("users", "users.user_id", "comments.commenter_id")
      .select(
         "users.first_name",
         "users.last_name",
         "comments.comment",
         "comments.comment_time",
         "comments.record_link"
      )
      .where("comments.assignment_id", "=", assignment_id);
};

const updateTableRow = ({
   table_name,
   where_column,
   where_value,
   update_data,
   returning_column,
}) => {
   return db(table_name)
      .where({
         [where_column]: where_value,
      })
      .update(update_data, returning_column);
};

module.exports = {
  insert_into_table,
  getUserFromEmail,
  getUserFromUserId,
  getTeacherClasses,
  getStudentClassesCode,
  getStudentClasses,
  get_from_table,
  get_all_column_from_table,
  updateTableRow,
  get_from_table_multiple_condition,
  getAllAssignments,
  getComments,
  getAllStudents,
};
