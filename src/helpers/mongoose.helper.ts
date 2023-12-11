import mongoose from 'mongoose';

export default class MongooseHelper {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static #connection?: any;

  static async startConnection() {
    if (
      !this.#connection ||
      this.#connection.readyState === 0 ||
      this.#connection.readyState === 3
    )
      this.#connection = await mongoose.connect(
        `${process.env.DB_CONNECTION}`,
        { maxPoolSize: 10 }
      );
  }

  static async closeConnection() {
    if (!this.#connection) return;

    await this.#connection.disconnect();
    this.#connection = undefined;
  }
}
