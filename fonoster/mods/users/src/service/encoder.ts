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
import { User } from "./protos/users_pb";

export default (user: User, secretHash: string): string => {
  if (!user) {
    return null;
  }
  const userJSON = {
    ref: user.getRef(),
    accessKeyId: user.getAccessKeyId(),
    email: user.getEmail(),
    name: user.getName(),
    avatar: user.getAvatar(),
    createTime: user.getCreateTime(),
    updateTime: user.getUpdateTime(),
    limiter: user.getLimiter(),
    status: user.getStatus(),
    secretHash
  };
  return JSON.stringify(userJSON);
};
