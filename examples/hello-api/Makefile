# Requirements
GIT = $(shell command -v git || { echo "git not found." >&2; exit 1; })
NODE = $(shell command -v node || { echo "node not found." >&2; exit 1; })
NPM = $(shell command -v npm || { echo "npm not found." >&2; exit 1; })
TAR = $(shell command -v tar || { echo "tar not found." >&2; exit 1; })
YARN = $(shell command -v yarn || { echo "yarn not found." >&2; exit 1; })

# Directories
MODULES_DIR := node_modules
BIN_DIR := $(MODULES_DIR)/.bin

SRC_DIR = src
DIST_DIR = dist
TEST_DIR = test

JS_DIR := $(DIST_DIR)/ts
BABEL_DIR := $(DIST_DIR)/babel
PKG_DIR := $(DIST_DIR)/release

# Dev tools
BABEL := $(BIN_DIR)/babel
REFRESHIFY := $(BIN_DIR)/refreshify
TAPE := $(BIN_DIR)/tape
TAP-SPEC := $(BIN_DIR)/tap-spec
TSC := $(BIN_DIR)/tsc
TSLINT := $(BIN_DIR)/tslint

# Files
TS_FILES = $(shell find $(SRC_DIR) -name "*.ts" -o -name "*.tsx" -type f | sort)
DEV_SERVER = server.js
DEV_BUNDLE = api.js
TSCONFIG_DEV = tsconfig.json
TSCONFIG_PROD = tsconfig.prod.json
RELEASE_TARBALL = hello-api.tar.gz

# Tasks
CP    = cp
MKDIR = mkdir -p
MV    = mv
RM    = rm -rf

# Flags
DIST_FLAGS ?= zcvf $(RELEASE_TARBALL) -C $(PKG_DIR) .
TEST_FLAGS ?= -r babel-register $(TEST_DIR)/**/*.js
WATCH_FLAGS ?= $(SRC_DIR)/index.ts -p tsify -s api -d -v -o $(DEV_BUNDLE) -t babelify

# Info
INFO = "\\033[34m[+] $@\\033[0m"

.PHONY: all
all: build

.PHONY: clean
clean:
	@echo $(INFO)
	@$(RM) $(DIST_DIR) $(DEV_BUNDLE)

.PHONY: distclean
distclean: clean
	@echo $(INFO)
	@$(RM) $(MODULES_DIR)

.PHONY: lint
lint: $(SRC_DIR)
	@echo $(INFO)
	@$(TSLINT) $(TS_FILES)

.PHONY: install
install: package.json
	@echo $(INFO)
	@$(YARN)

.PHONY: build-ts
build-ts: clean install lint $(SRC_DIR)
	@echo $(INFO)
	@$(RM) $(JS_DIR)
	@$(TSC) -p $(TSCONFIG_PROD)

$(JS_DIR): $(SRC_DIR)
	@echo $(INFO)

.PHONY: build-babel
build-babel: $(JS_DIR)
	@echo $(INFO)
	@$(RM) $(BABEL_DIR)
	@NODE_ENV=production $(BABEL) $(JS_DIR) -d $(BABEL_DIR)

$(BABEL_DIR): $(JS_DIR)
	@echo $(INFO)

.PHONY: build
build: build-ts build-babel
	@echo $(INFO)

.PHONY: dist
dist: $(BABEL_DIR)
	@echo $(INFO)
	@$(RM) $(PKG_DIR)
	@$(CP) -R $(BABEL_DIR) $(PKG_DIR)
	@$(CP) package.json $(PKG_DIR)
	@$(TAR) $(DIST_FLAGS)

$(PKG_DIR): $(BABEL_DIR)
	@echo $(INFO)

.PHONY: test
test: $(PKG_DIR)
	@echo $(INFO)
	@$(TAPE) $(TEST_FLAGS) | $(TAP-SPEC)

.PHONY: watch
watch: install lint $(SRC_DIR)
	@echo $(INFO)
	@$(REFRESHIFY) $(WATCH_FLAGS)

.PHONY: serve
serve:
	@echo $(INFO)
	@$(NODE) $(DEV_SERVER)

.PHONY: start
start:
	@echo $(INFO)
	@$(MAKE) watch & $(MAKE) serve

.PHONY: release
release: build test dist
	@echo $(INFO)
