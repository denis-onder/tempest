// tslint:disable: max-line-length
import chai from "chai";
import IPostRequest from "../interfaces/IPostRequest";
import ILoginRequest from "../interfaces/ILoginRequest";
import callApi from "./callApi";

const testUser: ILoginRequest = {
  email: "test@mail.com",
  password: "test1234"
};

const title = `A test post ${Math.floor(Math.random() * 10000)}`;
const testPost: IPostRequest = {
  user_id: 1,
  title,
  handle: title
    .split(" ")
    .join("-")
    .toLowerCase(),
  body: `# Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n
  ### Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n
  > Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`
};

const updatedTitle = `An updated test post ${Math.floor(
  Math.random() * 10000
)}`;
const updatedTestPost: IPostRequest = {
  user_id: 1,
  title: updatedTitle,
  handle: updatedTitle
    .split(" ")
    .join("-")
    .toLowerCase(),
  body: `# Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n
### Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n
> Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`
};

describe("Post Controller", () => {
  describe("Create", () => {
    it("should return the new post object", async () => {
      const user = await callApi("post", "/auth/login", testUser);
      const response = await callApi(
        "post",
        "/posts/create",
        testPost,
        user.data.token
      );
      chai.expect(response.status).to.eq(200);
      chai
        .expect(response.data)
        .to.have.all.keys(
          "id",
          "user_id",
          "title",
          "handle",
          "body",
          "createdAt",
          "updatedAt"
        );
    });
  });
  describe("Get", () => {
    it("should return the post as an object", async () => {
      const response = await callApi("get", `/posts/get/${testPost.handle}`);
      chai.expect(response.status).to.eq(200);
      chai
        .expect(response.data)
        .to.have.all.keys(
          "id",
          "user_id",
          "title",
          "handle",
          "body",
          "createdAt",
          "updatedAt"
        );
    });
  });
  describe("Edit", () => {
    it("should return the edited post as an object", async () => {
      const user = await callApi("post", "/auth/login", testUser);
      const response = await callApi(
        "put",
        `/posts/edit/${testPost.handle}`,
        updatedTestPost,
        user.data.token
      );
      chai.expect(response.status).to.eq(200);
      chai
        .expect(response.data)
        .to.have.all.keys(
          "id",
          "user_id",
          "title",
          "handle",
          "body",
          "createdAt",
          "updatedAt"
        );
    });
  });
  describe("Delete", () => {
    it("should return an object with the success prop", async () => {
      const user = await callApi("post", "/auth/login", testUser);
      const response = await callApi(
        "delete",
        `/posts/delete/${updatedTestPost.handle}`,
        {},
        user.data.token
      );
      chai.expect(response.status).to.eq(200);
      chai.expect(response.data).to.have.all.keys("success", "timestamp");
    });
  });
});
