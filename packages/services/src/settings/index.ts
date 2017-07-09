// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
  ISettingRegistry, URLExt
} from '@jupyterlab/coreutils';

import {
  JSONObject
} from '@phosphor/coreutils';

import {
  ServerConnection
} from '..';


/**
 * The url for the lab settings service.
 */
const SERVICE_SETTINGS_URL = 'labsettings';


/**
 * The static namespace for `SettingService`.
 */
export
namespace SettingService {
  /**
   * Fetch a plugin's settings.
   *
   * @param id - The plugin's ID.
   *
   * @returns A promise that resolves with the plugin settings.
   */
  export
  function fetch(id: string): Promise<ISettingRegistry.IPlugin> {
    const request = { method: 'GET', url: Private.url(id) };
    const { serverSettings } = Private;
    const promise = ServerConnection.makeRequest(request, serverSettings);

    return promise.then(response => {
      const { status } = response.xhr;

      if (!Private.ok(status)) {
        throw ServerConnection.makeError(response);
      }

      return response.data;
    }).catch(reason => { throw ServerConnection.makeError(reason); });
  }

  /**
   * Save a plugin's settings.
   *
   * @param id - The plugin's ID.
   *
   * @param user - The plugin's user setting values.
   *
   * @returns A promise that resolves when saving is complete.
   */
  export
  function save(id: string, user: JSONObject): Promise<void> {
    const request = {
      data: JSON.stringify(user),
      method: 'PATCH',
      url: Private.url(id)
    };
    const { serverSettings } = Private;
    const promise = ServerConnection.makeRequest(request, serverSettings);

    return promise.then(response => {
      const { status } = response.xhr;

      if (!Private.ok(status)) {
        throw ServerConnection.makeError(response);
      }

      return void 0;
    }).catch(reason => { throw ServerConnection.makeError(reason); });
  }
}


/**
 * A namespace for private data.
 */
namespace Private {
  /**
   * The API connection settings.
   */
  export
  const serverSettings = ServerConnection.makeSettings();

  /**
   * Checks if an HTTP status is in the 200 range.
   */
  export
  function ok(status: number): boolean {
    return status >= 200 && status < 300;
  }

  /**
   * Get the url for a plugin's settings.
   */
  export
  function url(id: string): string {
    return URLExt.join(serverSettings.baseUrl, SERVICE_SETTINGS_URL, id);
  }
}
