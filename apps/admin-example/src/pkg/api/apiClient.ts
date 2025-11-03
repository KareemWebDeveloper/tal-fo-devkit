import { createClient } from "@connectrpc/connect";
import { AuthInterceptor, ErrorInterceptor } from "@devkitvue/apiclient";
import { createConnectTransport } from "@connectrpc/connect-web";
import { TalService } from "@buf/mawhub_tal.bufbuild_es/tal/v1/tal_service_pb";
import router from "@/pkg/router";
const transport = createConnectTransport({
  baseUrl: import.meta.env.VITE_API_URL,
  fetch: (input, init) => {
    return fetch(input, {
      ...init,
      credentials: "include", // 👈 inject credentials here
    });
  },

  interceptors: [
    AuthInterceptor("token"),

    ErrorInterceptor({
      onUnauthenticated: (e) => {
        console.log("err", e);
      },
      onUnauthorized: () => router.push("/forbidden"),
      onInternal: (err) => {
        console.log("show me the internal error here", err);
      },
    }),
  ],
  useHttpGet: true,
});

export const apiClient = createClient(TalService, transport);


// import { Client, createClient } from "@connectrpc/connect";
// import { createConnectTransport } from "@connectrpc/connect-web";
// import { TalService } from "@buf/mawhub_tal.bufbuild_es/tal/v1/tal_service_pb";

// const transport = createConnectTransport({
//   baseUrl: import.meta.env.VITE_API_URL,
//   fetch: (input, init) => {
//     return fetch(input, {
//       ...init,
//       credentials: "include", // 👈 inject credentials here
//     });
//   },
//   useHttpGet: true,
// });

// export const apiClient: Client<typeof TalService> = createClient(
//   TalService,
//   transport,
// );