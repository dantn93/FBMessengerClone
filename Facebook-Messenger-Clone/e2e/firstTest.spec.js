describe.skip('Go to ChatScreen', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
    await expect(element(by.id('LoginView'))).toBeVisible();
    await element(by.id('EmailTap')).tap();
    await expect(element(by.id('MessagesScreen'))).toBeVisible();
  });

  it('Login => MessageScreen => ChatScreen => MessageScreen', async () => {
    await expect(element(by.id('FlatList'))).toBeVisible();
    await waitFor(element(by.id('RoomIndex0'))).toBeVisible().withTimeout(2000);
    await element(by.id('RoomIndex0')).tap();
    await expect(element(by.id('ChatScreen'))).toBeVisible();
    await element(by.id('GoBack')).tap();
  });

  it('Login => MessageScreen => ActiveScreen => ChatScreen => ActiveScreen', async () => {
    await element(by.text('ACTIVE')).tap();
    await expect(element(by.id('ActiveScreen'))).toBeVisible();
    await expect(element(by.id('ActiveFlatList'))).toBeVisible();
    await element(by.id('ActiveIndex0')).tap();
    await waitFor(element(by.id('ChatScreen'))).toBeVisible().withTimeout(2000);
    await element(by.id('GoBack')).tap();
  });
});

describe('Switch tabs', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
    await expect(element(by.id('LoginView'))).toBeVisible();
    await element(by.id('EmailTap')).tap();
    await expect(element(by.id('MessagesScreen'))).toBeVisible();
  });

  xit('Switch top tabs', async () => {
    await element(by.text('ACTIVE')).tap();
    await expect(element(by.id('ActiveScreen'))).toBeVisible();
    await element(by.text('GROUPS')).tap();
    await expect(element(by.id('GroupsScreen'))).toBeVisible();
    await element(by.text('CALLS')).tap();
    await expect(element(by.id('CallsScreen'))).toBeVisible();
    await element(by.text('MESSAGE')).tap();
    await expect(element(by.id('MessagesScreen'))).toBeVisible();
  });

  it('Switch bottom tabs', async () => {
    await element(by.id('PeopleTabIcon')).tap();
    await expect(element(by.id('PeopleScreen'))).toBeVisible();

    await element(by.id('CameraTabIcon')).tap();
    await expect(element(by.id('CameraScreen'))).toBeVisible();

    await waitFor(element(by.id('CameraGoBack'))).toBeVisible().withTimeout(500);
    await element(by.id('CameraGoBack')).tap();

    await element(by.id('GamesTabIcon')).tap();
    await expect(element(by.id('GameScreen'))).toBeVisible();

    await element(by.id('HomeTabIcon')).tap();
    await expect(element(by.id('MessagesScreen'))).toBeVisible();

    await element(by.id('PopularTabIcon')).tap();
    await expect(element(by.id('PopularScreen'))).toBeVisible();
  });
});