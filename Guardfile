mocha_config = {
  mocha_bin: File.expand_path("../node_modules/mocha/bin/mocha","__FILE__"),
  coffeescript: false,
  all_on_start: true,
  all_after_pass: true,
  keep_failed: true,
}

guard "mocha-node", mocha_config do
  watch(%r{^spec/.+_spec\.js$})
  watch(%r{^lib/(.+)\.js$})     { |m| "spec/lib/#{m[1]}_spec.js" }
  watch('spec/spec_helper.js')
end

