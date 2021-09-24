# Contributing to the Maki ecosystem

Thanks for taking the time to contribute!
You can start by reading our [Contribution guidelines](https://docs.makiswap.com/code/contributing) first.

## Setup

Create a `.env.development.local` file at the root of the project. Add the following lines inside :

    ```
    REACT_APP_CROWDIN_APIKEY = ""
    REACT_APP_CROWDIN_PROJECTID = ""
    ```

You'll need this in order to get the i18n system to work. Contact a dev if you need these values.

Install the dependencies.

    ```shell
    yarn
    yarn start
    ```

Don't forget to setup your IDE with `eslint` and `prettier`.

## Project structure

- **components** contains generic components used inside the application.
- **views** contains building blocks for each page. The entry point of a view is used as the root component of each route.
- **config** contains all the config files and ABIs.
- **state** contains the redux files for the global state of the app.
- **context** contains global contexts (separated from the redux store)
- **hooks** contains generic hooks.
- **utils** contains generic utilities functions.

## Tests

Run tests with `yarn test`.

## Localization

_In order for the Crowdin API queries to work - you will need `REACT_APP_CROWDIN_APIKEY` & `REACT_APP_CROWDIN_PROJECTID` env variables set in your root `.env.development.local` file_

#### Dynamic variables Example

If a Crowdin translation like this `You have %num% left in your wallet` - would look something like:

    ```
    TranslateString(675, `You have ${makiBalance} left in your wallet`, { num: makiBalance })
    ```
