<template>
  <v-container fluid>
    <v-row no-gutters class="ma-4">
      <v-col cols="12">
        <div class="d-flex pt-4 mb-4">
          <h3 class="mr-4">Program:</h3>
          <v-progress-circular v-if="loadingProgram" indeterminate />
          <h3 v-else>{{ program.publicKey }}</h3>
          <v-spacer />
          <v-btn v-if="this.address.length == 0 && program" @click="winner">
            WINNER
          </v-btn>
          <v-spacer />
          <v-progress-circular v-if="loadingVote" indeterminate />
        </div>
        <div class="d-flex">
          <p class="mr-2 mt-4">Select Wallet:</p>
          <v-select v-model="wallet" :items="address" label="Select Wallet">
          </v-select>
        </div>
      </v-col>
    </v-row>
    <v-row class="d-flex justify-center" v-if="loadingProgram">
      <v-progress-circular indeterminate />
    </v-row>
    <v-row no-gutters v-else :disabled="true">
      <v-col cols="3" v-for="(candidate, index) of candidates" :key="index">
        <v-card rounded="xl" class="ma-4">
          <v-card-title class="d-flex justify-center">
            <v-avatar size="200">
              <v-img
                src="https://cdn.vuetifyjs.com/images/john.jpg"
                alt="John"
              ></v-img>
            </v-avatar>
          </v-card-title>
          <v-card-text class="d-flex justify-center text-h4 text-weight-3">
            <p class="my-4">{{ candidate.name }}</p>
          </v-card-text>
          <v-card-actions class="ma-4">
            <v-btn
              :disabled="!wallet || loadingVote"
              color="primary"
              block
              variant="flat"
              dark
              @click="vote(candidate.name)"
            >
              VOTE
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row no-gutters v-if="results.length > 0">
      <v-data-table
        :headers="[
          {
            text: 'name',
            value: 'name',
            align: 'center',
          },
          {
            text: 'quantity',
            value: 'quantity',
            align: 'center',
          },
        ]"
        :items="results"
      >
      </v-data-table>
    </v-row>
    <v-alert
      v-if="errorMsg"
      closable
      :text="errorMsg"
      type="error"
      style="position: absolute; bottom: 0; right: 0"
    ></v-alert>
    <v-alert
      v-if="successTx"
      closable
      :text="tx_hash"
      type="success"
      style="position: absolute; bottom: 0; right: 0"
    ></v-alert>
  </v-container>
</template>

<script>
import API from "@/services/api";

export default {
  name: "App",
  data: () => ({
    candidates: [
      {
        name: "Rafael",
        image: "",
      },
      {
        name: "Samuel",
        image: "",
      },
      {
        name: "Lisset",
        image: "",
      },
      {
        name: "Fredy",
        image: "",
      },
      {
        name: "Nestor",
        image: "",
      },
    ],
    wallets: [],
    wallet: null,
    snackbar: false,
    errorMsg: undefined,
    program: undefined,
    loadingProgram: true,
    address: [],
    successTx: false,
    tx_hash: undefined,
    loadingVote: false,
    results: [],
  }),
  async mounted() {
    try {
      this.loadingProgram = true;
      this.errorMsg = "";
      this.program = await API.createWallet();
      this.wallets = await API.createVoters();
      this.wallets.forEach((account) => {
        this.address.push(account.publicKey);
      });
    } catch (error) {
      this.errorMsg = error.message;
    } finally {
      this.loadingProgram = false;
    }
  },
  methods: {
    async vote(election) {
      try {
        this.successTx = false;
        this.loadingVote = true;
        this.errorMsg = "";
        const index = this.wallets.findIndex(
          (w) => w.publicKey === this.wallet
        );
        this.tx_hash = await API.vote(
          this.wallets[index],
          election,
          this.program
        );
        this.successTx = true;
        this.wallets.splice(index, 1);
        this.address = this.wallets.map((w) => {
          return w.publicKey;
        });
        this.wallet = null;
      } catch (error) {
        this.errorMsg = error.message;
      } finally {
        this.loadingVote = false;
      }
    },
    async winner() {
      try {
        const pepe = await API.getWinner(this.program);
        let gh = "";
        for (let p of pepe) {
          gh += `${p.name}: ${p.quantity} `;
        }
        alert(gh);
      } catch (error) {
        this.errorMsg = error.message;
      }
    },
  },
};
</script>

<style></style>
