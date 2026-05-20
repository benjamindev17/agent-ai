function renderDomainView(){
  var isFR=lang==='fr';
  var jquMsg=isFR
    ?"Bonjour JQU, le devis de renouvellement de domaine pour ce client est expiré. Peux-tu vérifier la disponibilité et étendre la date d'expiration s'il te plaît ?"
    :"Hi JQU, the domain renewal quote for this client has expired. Could you check the availability and extend the expiry date please?";
  window._domJquMsg=jquMsg;
  var cardStyle="background:rgba(255,255,255,0.25);backdrop-filter:blur(18px);border:1px solid rgba(255,255,255,0.35);border-radius:14px;padding:20px 22px;margin-bottom:16px;";
  var sectionTitle="font-size:15px;font-weight:700;color:#fff;margin:0 0 14px;letter-spacing:0.3px;";
  var subTitle="font-size:13px;font-weight:600;color:rgba(255,255,255,0.9);margin:0 0 6px;";
  var desc="font-size:12.5px;color:rgba(255,255,255,0.75);margin:0 0 10px;line-height:1.5;";
  var btnStyle="background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.3);border-radius:8px;padding:8px 14px;color:#fff;font-size:12px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px;text-decoration:none;transition:background 0.2s;";
  var partnerBanner="background:rgba(255,209,102,0.12);border:1px solid rgba(255,209,102,0.35);border-radius:10px;padding:12px 16px;margin-bottom:14px;font-size:12.5px;color:rgba(255,255,255,0.85);line-height:1.5;";
  var alertStyle="background:rgba(255,80,60,0.18);border:1.5px solid rgba(255,80,60,0.5);border-radius:10px;padding:14px 16px;margin-bottom:12px;";
  var divider="border:none;border-top:1px solid rgba(255,255,255,0.15);margin:14px 0;";
  var pathStyle="font-size:12px;color:rgba(255,255,255,0.75);margin:10px 0 14px;line-height:1.6;";
  var linkRow="display:flex;align-items:center;gap:8px;margin-bottom:8px;";
  var videoUrl='http://odoo.com/fr_FR/slides/slide/register-a-free-domain-name-1663';
  var docUrl='https://www.odoo.com/documentation/master/applications/websites/website/configuration/domain_names.html';
  var gandiUrl='https://www.gandi.net/en';

  var whoisUrl='https://who.is';
  var mockupRow="display:flex;align-items:center;padding:5px 10px;border-bottom:1px solid #e8e8e8;font-size:12px;";
  var mockupLabel="color:#555;width:130px;flex-shrink:0;";
  var mockupVal="color:#1a1a2e;font-weight:500;flex:1;display:flex;align-items:center;gap:6px;";
  var checkboxOn="display:inline-block;width:14px;height:14px;background:#00a09d;border:1.5px solid #00a09d;border-radius:3px;position:relative;flex-shrink:0;";
  var checkmark="content:'';position:absolute;left:2px;top:0px;width:4px;height:8px;border:2px solid #fff;border-top:none;border-left:none;transform:rotate(45deg);";

  var h='<div style="color:#fff;">'
  // Section A
  +'<div style="'+cardStyle+'">'
  +'<p style="'+sectionTitle+'">'+t('domainSecATitle')+'</p>'
  +'<div style="'+partnerBanner+'">'+t('domainPartnershipInfo')+'</div>'
  // A1
  +'<p style="'+subTitle+'">① '+t('domainFreeTitle')+'</p>'
  +'<p style="'+desc+'">'+t('domainFreeDesc')+'</p>'
  +'<div style="'+linkRow+'">'
  +'<a href="'+videoUrl+'" target="_blank" rel="noopener" style="'+btnStyle+'">'+t('domainFreeVideo')+'</a>'
  +'</div>'
  +'<hr style="'+divider+'">'
  // A2
  +'<p style="'+subTitle+'">② '+t('domainCustomTitle')+'</p>'
  +'<p style="'+desc+'">'+t('domainCustomDesc')+'</p>'
  +'<div style="'+linkRow+'">'
  +'<a href="'+docUrl+'" target="_blank" rel="noopener" style="'+btnStyle+'">'+t('domainCustomDoc')+'</a>'
  +'</div>'
  +'<p style="'+desc+'margin-top:8px;">'+t('domainCustomMagicSheet')+'</p>'
  +'</div>'
  // Section B
  +'<div style="'+cardStyle+'">'
  +'<p style="'+sectionTitle+'">'+t('domainSecBTitle')+'</p>'
  +'<p style="'+desc+'">'+t('domainRenewalIntro')+'</p>'
  // Email confirmed subsection
  +'<p style="'+subTitle+'margin-bottom:8px;">📧 '+t('domainEmailConfirmTitle')+'</p>'
  +'<p style="'+desc+'">'+t('domainEmailConfirmPath')+'</p>'
  // Odoo UI mockup
  +'<div style="background:#f5f5f5;border-radius:8px;overflow:hidden;border:1px solid #ddd;margin-bottom:10px;font-family:sans-serif;">'
  +'<div style="'+mockupRow+'"><span style="'+mockupLabel+'">FQDN</span><span style="'+mockupVal+'">████████████</span></div>'
  +'<div style="'+mockupRow+'"><span style="'+mockupLabel+'">Expiration Date</span><span style="'+mockupVal+'">23 Feb 2027</span></div>'
  +'<div style="'+mockupRow+'"><span style="'+mockupLabel+'">Delete Date</span><span style="'+mockupVal+'">4 Apr 2027</span></div>'
  +'<div style="'+mockupRow+'"><span style="'+mockupLabel+'">Owner</span><span style="'+mockupVal+'">████████</span></div>'
  +'<div style="'+mockupRow+'"><span style="'+mockupLabel+'">Database</span><span style="'+mockupVal+'">████████████████</span></div>'
  +'<div style="'+mockupRow+'"><span style="'+mockupLabel+'">Contract</span><span style="'+mockupVal+'">████████████████████</span></div>'
  +'<div style="'+mockupRow+'"><span style="'+mockupLabel+'">Is synchronized</span><span style="'+mockupVal+'"><span style="'+checkboxOn+'"><span style="position:absolute;left:2px;top:0;width:4px;height:8px;border:2px solid #fff;border-top:none;border-left:none;transform:rotate(45deg);display:block;"></span></span></span></div>'
  +'<div style="'+mockupRow+'"><span style="'+mockupLabel+'">State</span><span style="'+mockupVal+'">Integrated</span></div>'
  +'<div style="background:#fff3cd;'+mockupRow+'border-left:3px solid #e53e3e;">'
  +'<span style="'+mockupLabel+'font-weight:700;color:#1a1a2e;">Email Confirmed</span>'
  +'<span style="'+mockupVal+'">'
  +'<span style="'+checkboxOn+'"><span style="position:absolute;left:2px;top:0;width:4px;height:8px;border:2px solid #fff;border-top:none;border-left:none;transform:rotate(45deg);display:block;"></span></span>'
  +'<span style="color:#e53e3e;font-size:18px;font-weight:700;margin-left:4px;">←</span>'
  +'</span></div>'
  +'<div style="'+mockupRow+'border-bottom:none;"><span style="'+mockupLabel+'">Active</span><span style="'+mockupVal+'"><span style="'+checkboxOn+'"><span style="position:absolute;left:2px;top:0;width:4px;height:8px;border:2px solid #fff;border-top:none;border-left:none;transform:rotate(45deg);display:block;"></span></span></span></div>'
  +'</div>'
  +'<p style="'+desc+'">'+t('domainEmailConfirmCheck')+'</p>'
  +'<hr style="'+divider+'">'
  // Alert expired
  +'<div style="'+alertStyle+'">'
  +'<p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#FF6B5B;letter-spacing:0.5px;">🚨 '+t('domainAlertTitle')+'</p>'
  +'<p style="margin:0 0 2px;font-size:12.5px;color:rgba(255,255,255,0.9);">'+t('domainAlertText')+'</p>'
  +'<p style="margin:0;font-size:12.5px;color:rgba(255,255,255,0.9);">'+t('domainAlertInstruction')+'</p>'
  +'</div>'
  +'<p style="'+pathStyle+'">'+t('domainRenewalPath')+'</p>'
  +'<button id="btn-copy-jqu" onclick="huntingCopy(window._domJquMsg,\'btn-copy-jqu\',\''+t('domainCopyJqu').replace(/'/g,"\\'")+'\')" style="'+btnStyle+'">'+t('domainCopyJqu')+'</button>'
  +'</div>'
  // Section C
  +'<div style="'+cardStyle+'">'
  +'<p style="'+sectionTitle+'">'+t('domainSecCTitle')+'</p>'
  +'<div style="'+linkRow+'">'
  +'<a href="'+videoUrl+'" target="_blank" rel="noopener" style="'+btnStyle+'">▶️ '+t('domainLinkVideo')+'</a>'
  +'</div>'
  +'<div style="'+linkRow+'">'
  +'<a href="'+docUrl+'" target="_blank" rel="noopener" style="'+btnStyle+'">📄 '+t('domainLinkDoc')+'</a>'
  +'</div>'
  +'<div style="'+linkRow+'">'
  +'<a href="'+gandiUrl+'" target="_blank" rel="noopener" style="'+btnStyle+'">🌐 '+t('domainLinkGandi')+'</a>'
  +'</div>'
  +'<div style="'+linkRow+'">'
  +'<a href="'+whoisUrl+'" target="_blank" rel="noopener" style="'+btnStyle+'">🔍 '+t('domainLinkWhois')+'</a>'
  +'</div>'
  +'</div>'
  +'</div>';
  el('domain-content').innerHTML=h;
}
