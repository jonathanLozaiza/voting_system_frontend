import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000",
});

export default {
  async createWallet() {
    try {
      const {
        data: { wallet },
      } = await API.get("/wallet/create-wallet");
      return wallet;
    } catch (error) {
      const errorResponse = error.response.data;
      throw new Error(errorResponse.message || errorResponse.error);
    }
  },
  async createVoters() {
    try {
      const {
        data: { wallets },
      } = await API.get("/wallet/create-voters");
      return wallets;
    } catch (error) {
      const errorResponse = error.response.data;
      throw new Error(errorResponse.message || errorResponse.error);
    }
  },
  async vote(wallet, election, program) {
    try {
      const {
        data: { tx_hash },
      } = await API.post("/vote", { wallet, election, program });
      return tx_hash;
    } catch (error) {
      const errorResponse = error.response.data;
      throw new Error(errorResponse.message || errorResponse.error);
    }
  },
  async getWinner(program) {
    try {
      const {
        data: { results },
      } = await API.get(`/vote/get-winner?seed=${program.seed}`);
      return results;
    } catch (error) {
      const errorResponse = error.response.data;
      throw new Error(errorResponse.message || errorResponse.error);
    }
  },
};
