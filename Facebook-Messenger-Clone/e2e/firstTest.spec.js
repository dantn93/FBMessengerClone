describe('Example', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  // it('should have login view screen', async () => {
  //   await expect(element(by.id('LoginView'))).toBeVisible();
  // });

  it('should show accoutkit login', async () => {
    await expect(element(by.id('LoginView'))).toBeVisible();
    // await element(by.id('EmailTap')).tap();
    await expect(element(by.id('Splash'))).toBeVisible();
  });

  // it('should show hello screen after tap', async () => {
  //   await element(by.id('hello_button')).tap();
  //   await expect(element(by.text('Hello!!!'))).toBeVisible();
  // });

  // it('should show world screen after tap', async () => {
  //   await element(by.id('world_button')).tap();
  //   await expect(element(by.text('World!!!'))).toBeVisible();
  // });
});