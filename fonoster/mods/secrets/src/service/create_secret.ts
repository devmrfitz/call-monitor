/*
 * Copyright (C) 2023 by Fonoster Inc (https://fonoster.com)
 * http://github.com/fonoster/fonoster
 *
 * This file is part of Fonoster
 *
 * Licensed under the MIT License (the "License");
 * you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 *    https://opensource.org/licenses/MIT
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { APISERVER_VAULT_ADDR, APISERVER_VAULT_TOKEN } from "../env";
import { Secret } from "./protos/secrets_pb";
import getUserToken from "./token";
import Vault from "node-vault";

export default async function (
  name: string,
  secret: string,
  accessKeyId: string
): Promise<Secret> {
  const vault = Vault({
    endpoint: APISERVER_VAULT_ADDR,
    token: APISERVER_VAULT_TOKEN
  });
  const entityId = await getUserToken(accessKeyId);
  await vault.write(`secret/data/${entityId}/${name}`, {
    data: { value: secret }
  });
  const response = new Secret();
  response.setName(name);
  return response;
}
