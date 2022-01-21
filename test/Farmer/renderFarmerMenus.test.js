import { expect } from 'chai';
import { describe, it } from 'mocha';
import { renderFarmerMenus, renderFarmerMenusLevelTwo } from '../../src/menus/rendermenu.js';
import { promptToGive } from '../../src/users/farmer/farmerlocation.js';
import client from '../../src/server.js';

describe('Farmer', () => {
  it('should see the relevant first level menus', () => {
    expect(typeof (renderFarmerMenus())).to.equal('string');
    expect(renderFarmerMenus()).to.equal('CON 1. Update Location\n2. Add Farm Details\n3. Add product\n4. Update farmer details\n5. Update listed produce\n98.More');
  });
  it('should see the second level menus', () => {
    expect(typeof renderFarmerMenusLevelTwo()).to.equal('string');
    expect(renderFarmerMenusLevelTwo()).to.equal('CON 6. Join Group\n7. Crop Calendar');
  });
  it('on update location, further menus should be returned', async () => {
    const prompt = await promptToGive(client, 'region');
    expect(typeof prompt).to.equal('string');
  });
});