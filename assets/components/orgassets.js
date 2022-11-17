import { html, css, LitElement } from 'https://cdn.jsdelivr.net/npm/lit@^2/+esm' // 'https://cdn.skypack.dev/lit'
import 'https://cdn.jsdelivr.net/npm/@material/mwc-button@^0.25.0/+esm';
import { connect } from 'https://cdn.jsdelivr.net/npm/pwa-helpers@0/+esm'
import { auth, onAuthStateChanged } from '/assets/js/firebase.js'
import { getOrganization, getOrganizationAssets } from '../js/api.js';
import { endAction, startAction } from '../actions/index.js'
import { store } from '../redux/store.js'

export class OrgAssets extends connect(store)(LitElement) {
  static get properties() {
    return {
      assets: { type: Array },
      name: { type: String },
      logo: { type: String },
      loaded: { type: Boolean }
    }
  }

  constructor() {
    super();
    this.assets = [];
    this.loaded = false;
  }

  async connectedCallback() {
    super.connectedCallback();
    this.fetchData();
  }

  fetchData() {
    onAuthStateChanged(auth, async (user) => {
      console.log('getting organization assets:', orgId)
      console.log("STATE CHANGED in investments:", user)
      store.dispatch(startAction())
      try {
        if (user) {
          // this.signedIn = true
          console.log('getting assets')
          const org = await getOrganization(orgId)
          this.name = org.organization.name
          this.logo = org.organization.logo
          console.log('org:', org)
          const { assets } = await getOrganizationAssets(orgId);
          this.assets = [...assets]
          this.loaded = true
          console.log('asssets:', assets)
        } else {
          // this.signedIn = false
        }
      } catch (err) {
        console.log('error:', err)
      }
      store.dispatch(endAction())
    });
  }

  render() {
    console.log('rendering assets:', this.assets)
    return html`<div class="container px-4 py-5 my-5 text-center justify-content-start">
            <h1 class="fw-bold width-auto mb-5">${this.name} Assets</h1>
            <img src=${this.logo}/>
            <div class="row mt-4 justify-content-center">
              ${this.assets.map(asset => html`<div class="col-xl-4 col-lg-4 col-md-6 col-sm-10 col-12 p-2">
              <a href=${`/assets/${asset.id}`} style="text-decoration:none;color:black;">
                          <div class="card full-height">
                            <div class="mt-3" style="height:100px">
                              <img class="card-img-top h-100" src=${asset.imgUrl} alt="Card image" style="object-fit:contain;width:auto"/>
                              <!--<div class="text-secondary" style="position:absolute;top:10px;right:10px;"><i class="fa-solid fa-heart"></i></div>-->
                            </div>
                            <div class="card-body text-start">
                              <b>${asset.name}</b>
                              <p class="card-text text-start text-secondary mt-2 small"><small>${asset.description}</small></p>
                              <div class="row" style="gap: 10px 0px">
                                <div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-6">
                                  <small class="text-secondary">Equity Offered</small><br/>
                                  <b>${asset.equity}%</b>
                                </div>
                                <div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-6">
                                  <small class="text-secondary">Seeking</small><br/>
                                  <b>${asset.seeking}USD</b>
                                </div>
                                <div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-6">
                                  <small class="text-secondary">Location</small><br/>
                                  <b>${asset.location}</b>
                                </div>
                                <div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-6">
                                  <small class="text-secondary">Category</small><br/>
                                  <b>${asset.category}</b>
                                </div>
                                <div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-6">
                                  <small class="text-secondary">Valuation</small><br/>
                                  <b>${asset.valuation}USD</b>
                                </div>
                                <div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-6">
                                  <small class="text-secondary">Share Price</small><br/>
                                  <b>${asset.sharePrice}USD</b>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>`)
      }
              ${(this.loaded && this.assets.length === 0) ? html`<h3>You have got no asset</h3><a href="/assetregister"><button type="button" class="btn btn-success">Register Asset</button></a>` : html``
      }
            </div>
          </a>
        </div>
        `
  }

  createRenderRoot() {
    return this;
  }
}

customElements.define('orgassets-panel', OrgAssets);