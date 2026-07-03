import { vibecoding } from './vibecoding'
import { git } from './git'
import { webdev } from './webdev'
import { reactTs } from './react-ts'
import { flutter } from './flutter'
import { mobilePublish } from './mobile-publish'
import { patterns } from './patterns'
import { algorithms } from './algorithms'
import { testing } from './testing'
import { backendBaas } from './backend-baas'
import { qa } from './qa'
import { kotlin } from './kotlin'
import { jsBasics } from './js-basics'
import { aiServices } from './ai-services'
import { supabase } from './supabase'
import { vercel } from './vercel'
import { css } from './css'
import { html } from './html'
import { net } from './net'
import { security } from './security'
import { cli } from './cli'
import { npm } from './npm'
import { debug } from './debug'

export { categories, categoryTitle } from './categories'

export const allEntries = [
  ...vibecoding,
  ...git,
  ...webdev,
  ...reactTs,
  ...jsBasics,
  ...html,
  ...css,
  ...net,
  ...flutter,
  ...kotlin,
  ...mobilePublish,
  ...patterns,
  ...algorithms,
  ...testing,
  ...backendBaas,
  ...supabase,
  ...vercel,
  ...security,
  ...cli,
  ...npm,
  ...qa,
  ...debug,
  ...aiServices,
]
